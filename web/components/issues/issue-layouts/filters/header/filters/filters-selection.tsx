import React, { useState } from "react";
import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import {
  FilterAssignees,
  FilterCreatedBy,
  FilterLabels,
  FilterPriority,
  FilterStartDate,
  FilterState,
  FilterStateGroup,
  FilterTargetDate,
} from "components/issues";
// icons
import { Search, X } from "lucide-react";
// helpers
import { getStatesList } from "helpers/state.helper";
// types
import { IIssueFilterOptions } from "types";
// constants
import { ILayoutDisplayFiltersOptions, ISSUE_PRIORITIES, ISSUE_STATE_GROUPS } from "constants/issue";
import { DATE_FILTER_OPTIONS } from "constants/filters";

type Props = {
  filters: IIssueFilterOptions;
  handleFiltersUpdate: (key: keyof IIssueFilterOptions, value: string | string[]) => void;
  layoutDisplayFiltersOptions: ILayoutDisplayFiltersOptions | undefined;
  projectId: string;
};

type ViewButtonProps = {
  handleLess: () => void;
  handleMore: () => void;
  isViewLessVisible: boolean;
  isViewMoreVisible: boolean;
};

const ViewButtons = ({ handleLess, handleMore, isViewLessVisible, isViewMoreVisible }: ViewButtonProps) => (
  <div className="flex items-center gap-2 ml-7 mt-1">
    {/* TODO: handle view more and less in a better way */}
    {isViewMoreVisible && (
      <button className="text-custom-primary-100 text-xs font-medium" onClick={handleMore}>
        View more
      </button>
    )}
    {isViewLessVisible && (
      <button className="text-custom-primary-100 text-xs font-medium" onClick={handleLess}>
        View less
      </button>
    )}
  </div>
);

export const FilterSelection: React.FC<Props> = observer((props) => {
  const { filters, handleFiltersUpdate, layoutDisplayFiltersOptions, projectId } = props;

  const [filtersSearchQuery, setFiltersSearchQuery] = useState("");

  const { project: projectStore } = useMobxStore();

  const statesList = getStatesList(projectStore.states?.[projectId?.toString() ?? ""]);

  const [filtersToRender, setFiltersToRender] = useState<{
    [key in keyof IIssueFilterOptions]: {
      currentLength: number;
      totalLength: number;
    };
  }>({
    assignees: {
      currentLength: 5,
      totalLength: projectStore.members?.[projectId]?.length ?? 0,
    },
    created_by: {
      currentLength: 5,
      totalLength: projectStore.members?.[projectId]?.length ?? 0,
    },
    labels: {
      currentLength: 5,
      totalLength: projectStore.labels?.[projectId]?.length ?? 0,
    },
    priority: {
      currentLength: 5,
      totalLength: ISSUE_PRIORITIES.length,
    },
    state_group: {
      currentLength: 5,
      totalLength: ISSUE_STATE_GROUPS.length,
    },
    state: {
      currentLength: 5,
      totalLength: statesList?.length ?? 0,
    },
    start_date: {
      currentLength: 5,
      totalLength: DATE_FILTER_OPTIONS.length + 1,
    },
    target_date: {
      currentLength: 5,
      totalLength: DATE_FILTER_OPTIONS.length + 1,
    },
  });

  const handleViewMore = (filterName: keyof IIssueFilterOptions) => {
    const filterDetails = filtersToRender[filterName];

    if (!filterDetails) return;

    if (filterDetails.currentLength <= filterDetails.totalLength)
      setFiltersToRender((prev) => ({
        ...prev,
        [filterName]: {
          ...prev[filterName],
          currentLength: filterDetails.currentLength + 5,
        },
      }));
  };

  const handleViewLess = (filterName: keyof IIssueFilterOptions) => {
    const filterDetails = filtersToRender[filterName];

    if (!filterDetails) return;

    setFiltersToRender((prev) => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        currentLength: 5,
      },
    }));
  };

  const isViewMoreVisible = (filterName: keyof IIssueFilterOptions): boolean => {
    const filterDetails = filtersToRender[filterName];

    if (!filterDetails) return false;

    return filterDetails.currentLength < filterDetails.totalLength;
  };

  const isViewLessVisible = (filterName: keyof IIssueFilterOptions): boolean => {
    const filterDetails = filtersToRender[filterName];

    if (!filterDetails) return false;

    return filterDetails.currentLength > 5;
  };

  const isFilterEnabled = (filter: keyof IIssueFilterOptions) => layoutDisplayFiltersOptions?.filters.includes(filter);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="p-2.5 pb-0 bg-custom-background-100">
        <div className="bg-custom-background-90 border-[0.5px] border-custom-border-200 text-xs rounded flex items-center gap-1.5 px-1.5 py-1">
          <Search className="text-custom-text-400" size={12} strokeWidth={2} />
          <input
            type="text"
            className="bg-custom-background-90 placeholder:text-custom-text-400 w-full outline-none"
            placeholder="Search"
            value={filtersSearchQuery}
            onChange={(e) => setFiltersSearchQuery(e.target.value)}
            autoFocus
          />
          {filtersSearchQuery !== "" && (
            <button type="button" className="grid place-items-center" onClick={() => setFiltersSearchQuery("")}>
              <X className="text-custom-text-300" size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full h-full divide-y divide-custom-border-200 px-2.5 overflow-y-auto">
        {/* priority */}
        {isFilterEnabled("priority") && (
          <div className="py-2">
            <FilterPriority
              appliedFilters={filters.priority ?? null}
              handleUpdate={(val) => handleFiltersUpdate("priority", val)}
              itemsToRender={filtersToRender.priority?.currentLength ?? 0}
              searchQuery={filtersSearchQuery}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("priority")}
                  isViewMoreVisible={isViewMoreVisible("priority")}
                  handleLess={() => handleViewLess("priority")}
                  handleMore={() => handleViewMore("priority")}
                />
              }
            />
          </div>
        )}

        {/* state group */}
        {isFilterEnabled("state_group") && (
          <div className="py-2">
            <FilterStateGroup
              appliedFilters={filters.state_group ?? null}
              handleUpdate={(val) => handleFiltersUpdate("state_group", val)}
              itemsToRender={filtersToRender.state_group?.currentLength ?? 0}
              searchQuery={filtersSearchQuery}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("state_group")}
                  isViewMoreVisible={isViewMoreVisible("state_group")}
                  handleLess={() => handleViewLess("state_group")}
                  handleMore={() => handleViewMore("state_group")}
                />
              }
            />
          </div>
        )}

        {/* state */}
        {isFilterEnabled("state") && (
          <div className="py-2">
            <FilterState
              appliedFilters={filters.state ?? null}
              handleUpdate={(val) => handleFiltersUpdate("state", val)}
              itemsToRender={filtersToRender.state?.currentLength ?? 0}
              searchQuery={filtersSearchQuery}
              states={projectStore.states?.[projectId]}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("state")}
                  isViewMoreVisible={isViewMoreVisible("state")}
                  handleLess={() => handleViewLess("state")}
                  handleMore={() => handleViewMore("state")}
                />
              }
            />
          </div>
        )}

        {/* assignees */}
        {isFilterEnabled("assignees") && (
          <div className="py-2">
            <FilterAssignees
              appliedFilters={filters.assignees ?? null}
              handleUpdate={(val) => handleFiltersUpdate("assignees", val)}
              itemsToRender={filtersToRender.assignees?.currentLength ?? 0}
              members={projectStore.members?.[projectId]?.map((m) => m.member) ?? undefined}
              searchQuery={filtersSearchQuery}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("assignees")}
                  isViewMoreVisible={isViewMoreVisible("assignees")}
                  handleLess={() => handleViewLess("assignees")}
                  handleMore={() => handleViewMore("assignees")}
                />
              }
            />
          </div>
        )}

        {/* created_by */}
        {isFilterEnabled("created_by") && (
          <div className="py-2">
            <FilterCreatedBy
              appliedFilters={filters.created_by ?? null}
              handleUpdate={(val) => handleFiltersUpdate("created_by", val)}
              itemsToRender={filtersToRender.created_by?.currentLength ?? 0}
              members={projectStore.members?.[projectId]?.map((m) => m.member) ?? undefined}
              searchQuery={filtersSearchQuery}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("created_by")}
                  isViewMoreVisible={isViewMoreVisible("created_by")}
                  handleLess={() => handleViewLess("created_by")}
                  handleMore={() => handleViewMore("created_by")}
                />
              }
            />
          </div>
        )}

        {/* labels */}
        {isFilterEnabled("labels") && (
          <div className="py-2">
            <FilterLabels
              appliedFilters={filters.labels ?? null}
              handleUpdate={(val) => handleFiltersUpdate("labels", val)}
              itemsToRender={filtersToRender.labels?.currentLength ?? 0}
              labels={projectStore.labels?.[projectId] ?? undefined}
              searchQuery={filtersSearchQuery}
              viewButtons={
                <ViewButtons
                  isViewLessVisible={isViewLessVisible("labels")}
                  isViewMoreVisible={isViewMoreVisible("labels")}
                  handleLess={() => handleViewLess("labels")}
                  handleMore={() => handleViewMore("labels")}
                />
              }
            />
          </div>
        )}

        {/* start_date */}
        {isFilterEnabled("start_date") && (
          <div className="py-2">
            <FilterStartDate
              appliedFilters={filters.start_date ?? null}
              handleUpdate={(val) => handleFiltersUpdate("start_date", val)}
              itemsToRender={filtersToRender.start_date?.currentLength ?? 0}
              searchQuery={filtersSearchQuery}
            />
          </div>
        )}

        {/* target_date */}
        {isFilterEnabled("target_date") && (
          <div className="py-2">
            <FilterTargetDate
              appliedFilters={filters.target_date ?? null}
              handleUpdate={(val) => handleFiltersUpdate("target_date", val)}
              itemsToRender={filtersToRender.target_date?.currentLength ?? 0}
              searchQuery={filtersSearchQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
});